const mongoose = require('mongoose');
const Cookie = mongoose.model('Cookie');
const fetch = require(`node-fetch`);
const headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'max-age=0',
    'cookie': '',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'sec-gpc': '1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36'
};

exports.multipleAccount = async (req, res, next) => {
    try {
        let json = req.body;
        if (!json) return res.render('index', { erro: "Preencha o nome das contas para pesquisar" });
        if (!json.conta) return res.render('index', { erro: "Preencha o nome das contas para pesquisar" });
        if (json.conta == '') return res.render('index', { erro: "Preencha o nome das contas para pesquisar" });
        let cookies = await Cookie.find({ block: false });
        if (!cookies) return res.render('index', { erro: "Serviço indisponivel no momento" });
        if (cookies.length <= 0) return res.render('index', { erro: "Serviço indisponivel no momento" });
        let contas = json.conta.replace(" ", ";").replace(",", ";").replace(":", ";")

    } catch (err) {
        res.render('index', { erro: `Erro: ${err}` })
    }
}

exports.singleAccount = async (req, res, next) => {
    try {
        let json = req.body;
        if (!json) return res.render('index', { erro: "Preencha o nome da conta para pesquisar" });
        if (!json.conta) return res.render('index', { erro: "Preencha o nome da conta para pesquisar" });
        if (json.conta == '') return res.render('index', { erro: "Preencha o nome da conta para pesquisar" });
        let cookies = await Cookie.find({ block: false });
        if (!cookies) return res.render('index', { erro: "Serviço indisponivel no momento" });
        if (cookies.length <= 0) return res.render('index', { erro: "Serviço indisponivel no momento" });
        let cookie = cookies[Math.floor(Math.random() * (cookies.length - 0) + 0)];
        let conta = json.conta.replace(" ", "").replace(",", "").replace(":", "");
        let h = headers;
        h.cookie = cookie.cookie;
        let data = await fetch(`https://www.instagram.com/${conta}/?__a=1`, {
            method: 'get',
            headers: h
        })
            .then((res) => {
                return res.json()
            })
            .catch((err) => {
                return false;
            });
            try {
                if (data == false) {
                    cookie.block = true;
                    await cookie.save();
                    return this.singleAccount(req, res, next);
                } //A conta que verifica tomo bloqueio
            }catch { }
            let dados = { };
            if (data.graphql != null) {
                //Conta ativa
                let user = data.graphql.user;
                let dc = {
                    "username":conta,
                    "seguidores":user.edge_followed_by.count,
                    "seguindo":user.edge_follow.count,
                    "bio":user.biography,
                    "link":`https://instagram.com/${conta}/`,
                    "block": false,
                    "image":user.profile_pic_url_hd
                }
                console.log(dc);
                return res.render('unico', {conta: dc});
            } else {
                let dc = {
                    "username":conta,
                    "seguidores":0,
                    "seguindo":0,
                    "bio":"",
                    "link":`https://instagram.com/${conta}/`,
                    "block": true,
                    "image":"https://i.imgur.com/vJc07wc.png"
                }
                console.log(dc);
                return res.render('unico', {conta: dc});
            }
    } catch (err) {
        res.render('index', { erro: `Erro: ${err}` })
    }
}