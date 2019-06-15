
const nodes = [{
    "name": "Mixin Official",
    "text": "The first mixin node.",
    "signer": "XINq9ctH1qYjxE8AsxJoH53qgNpS6hpL5mv5sFGML4Bf7tdpBD5LorhGBGpSF4tEKh9LD81XrXcaLA3CmTnCZU2NoKExsDh",
  }, {
    "name": "F1EX Node 42",
    "text": "A node hosted by Fox.ONE.",
    "signer": "XINBcaWrMMmnuKy3iGg4fbrpjxXx2inVNjG8g9V2u5xfbPQaowLfgapqpZW5wfY2AZU2BLvpbhrUc7UWRDWU6JifzCAeUHhA",
  }, {
    "name": "Big.ONE Node 01",
    "text": "The #1 node hosted by Big.ONE.",
    "signer": "XINZekNsVBN9GP49ZsMk8jGWVdkzHmjwTGxENKoYjRrSP1E6Xxsqg77n6TWMkCbZVCtL2WYsa4wdXUjUAXSnnNnG8aefBQRm",
  }, {
    "name": "Big.ONE Node 02",
    "text": "The #2 node hosted by Big.ONE.",
    "signer": "XINJbx6ja3cWtkJLQ2FPFCkRT98VuvAFWt4oKESr2eC3xBsQD9K7ypBcAr9upAEMn98LXiBGAfZoxUne745wi9mAooqPkRKN",
  }, {
    "name": "Big.ONE Node 03",
    "text": "The #3 node hosted by Big.ONE.",
    "signer": "XINPqENN3NbvB4fYArAt39s286WfYGA9qb4N6jyvsixK4KuMicVkUev8ZMMsA3AEKmxYsT3Mn7nYsurimABT7npdQcNLX2yG",
  }, {
    "name": "Big.ONE Node 04",
    "text": "The #4 node hosted by Big.ONE.",
    "signer": "XIN3E1zgtAVY2PYnJi91W3U3CeXvpnruEroBVWJRQn6x4VrFSN9rQfsqCZbEDc77ALGEqyiMFuSSq5ooSA3L2e4YG13RXfsm",
  }, {
    "name": "Big.ONE Node 05",
    "text": "The #5 node hosted by Big.ONE.",
    "signer": "XINRZtoDKwH2zEFK4vSv3eGGeQuB59gvyXpJ86VEdComApj1LGECaexCQRqdQDtdGvhKwRMWjstYhNcBHPwaSV7bz59htxGq",
  }, {
    "name": "Exin Node 0",
    "text": "The #0 node hosted by Exin.",
    "signer": "XINYgegkxh5n6oGMHkZYJ1dnCyTezczK3bK526BhB9aKbkDt92qSDZS532gsL3p6dSUHaH4QqiWfuAWdki3anzgw6r1JWdhY",
  }, {
    "name": "Candy",
    "text": "A node hosted by Candy.ONE.",
    "signer": "XINApqSd3ogfwkXpHLxU6r1G97hbHv8BjLuP8uhKzkm7Y2g8BwticWwKYvZVZX4Q4XaWiXJ4FVJ45eR35x9n2bQWuDM9PhBY",
    "host": "mixin-node.candy.one:7239"
  }, {
    "name": "Onda",
    "text": "A node hosted by Onda.cn.",
    "signer": "XINRcegmfY6y8CRE1GgYC1jhjHZ3cscXzvqvWhy77jwArGGpAMzxCtpwkUwWDuC1ZyLdikr6qey9MaXP9mLgEfSQsVPRtsVc",
  }, {
    "name": "Noodle",
    "text": "Flying Spaghetti Monster.",
    "signer": "XIN7W2kHuuKDM7Zjw62UAQK42C9F928EnANPz1dFrwkP9iimtZeFAd1LX6rKLwiugy2SwUJAuRkwScdMTbc6ZpyC3pXQjyQV",
  }, {
    "name": "Tako",
    "text": "A node hosted by tako app.",
    "signer": "XINB4VF9E5VE9zH5JWufsBaGZABAtVSQBd1v8TAuivUvAkmA9Cad8bp4ZLBERcYN7AojZy3BNSgNrWuhhULLFzQUTceQvfhq",
  }, {
    "name": "Seed-Studio",
    "text": "The #1 node hosted by Seed Studio.",
    "signer": "XINCVB9CGhm9Uia64JeNzmVaY6xMd2nmhrfAyLMyvvz3M8hZjYsR4mkUKHoTirkPuN6zsKBemUX9mu8WtCVR1CNXyNAwECfc",
  }, {
    "name": "EOSLaomao Node 0",
    "text": "The #0 node hosted by EOSLaomao.",
    "signer": "XIN29AqXsjAjMVqrCar5ZSbn138VuhPzdQScTsK95f1tVVMZHwgG13De6tudHMBdsGpmACHvqFH5fn4ProqtvHxbWhB8Wa2f",
  }, {
    "name": "EOSLaomao Node 1",
    "text": "The #1 node hosted by EOSLaomao.",
    "signer": "XINZsTSPsDFsYTYJDHnLD63nhhzhtsyokv8jK6fUHQNurGyV4WsMQrVFymsVVaNYe7YcdCPbLjSMDk3GbH1NAindN7TyTbwF",
  }
]

module.exports = {
  nodes: nodes,
  bucket: 'node1.f1ex.io',
  nodesFile: 'mixin-nodes.json',
  nodesStatFile: 'mixin-nodes-stat.json'
}