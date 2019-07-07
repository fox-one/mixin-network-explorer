package main

import (
	"fmt"
	"os"
	"time"

	"github.com/fox-one/gin-contrib/errors"
	"github.com/fox-one/gin-contrib/gin_helper"
	"github.com/fox-one/mixin-sdk/utils"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"github.com/urfave/cli"
)

var (
	errInvalidRequest = errors.New(100, "invalid request")
)

func main() {
	app := cli.NewApp()
	app.Name = "proxy"
	app.Version = "1.0"

	app.Flags = []cli.Flag{
		cli.BoolFlag{Name: "debug, d", Usage: "enable debug log"},
	}

	app.Before = func(c *cli.Context) error {
		if c.GlobalBool("debug") {
			log.SetLevel(log.DebugLevel)
		}

		if log.GetLevel() != log.DebugLevel {
			gin.SetMode(gin.ReleaseMode)
		}

		return nil
	}

	app.Commands = append(app.Commands, cli.Command{
		Name:        "proxy",
		Description: "start proxy server",
		Flags: []cli.Flag{
			cli.IntFlag{Name: "port, p", Value: 8081},
		},
		Action: func(c *cli.Context) error {
			addr := fmt.Sprintf(":%d", c.Int("port"))
			e := newGinEngine()
			e.POST("/proxy", proxy)

			return e.Run(addr)
		},
	})

	if err := app.Run(os.Args); err != nil {
		log.Error(err)
		os.Exit(1)
	}
}

func proxy(c *gin.Context) {
	var input = struct {
		URL    string `json:"url"`
		Method string `json:"method"`
		Body   string `json:"body"`
	}{}
	gin_helper.BindJson(c, &input)

	req, err := utils.NewRequest(input.URL, input.Method, input.Body)
	if err != nil {
		gin_helper.FailError(c, errInvalidRequest, err)
		return
	}

	bts, err := utils.DoRequest(req).Bytes()
	if err != nil {
		gin_helper.FailError(c, errInvalidRequest, err)
		return
	}

	gin_helper.OK(c, gin_helper.JSONString(bts))
}

func newGinEngine() *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery())

	loc, _ := time.LoadLocation("Asia/Chongqing")
	r.Use(gin_helper.Log(loc))

	corsOp := cors.DefaultConfig()
	corsOp.AllowCredentials = true
	corsOp.AllowHeaders = []string{
		"Authorization",
		"Origin",
		"Content-Type",
		"Access-Control-Allow-Origin",
	}
	corsOp.AllowOriginFunc = func(origin string) bool { return true }
	r.Use(cors.New(corsOp))

	return r
}
