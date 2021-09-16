var express = require("express");
var mysql = require('mysql');
const app = express();
const PORT = 7000;


var con = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "user",
    database: "biblioteca"
});

// con.connect(function (err) {
//     var resultado = 0;
//     if (err) throw err;
//     console.log("Conectado!");
//     var sql = "SELECT * FROM livros";
//     con.query(sql, function (err, result) {
//         resultado = result;
//         console.log(resultado);
//         if (err) throw err;
//         console.log("dado inserido: " + sql);
//     });
// });


app.set("view engine", "ejs");
app.set("views",__dirname,"/views");
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("public"));


//ROTA PAGINA PRINCIPAL
app.get("/", (req, res)=> {
    res.send("Home");
});


//ROTA LISTAGEM DE LIVROS
app.get("/livros", (req, res)=>{
    con.query(
        'SELECT * FROM livros', 
        (err, rows) => {
        if (err) throw err
    
        rows.forEach(row => {
            console.log(`${row.nome_livro}, ${row.autor_livro}, ${row.genero_livro}`)
        });
        res.render("livros", {livros_lista: rows})
    })
    
});

// app.get("/livros", (req, res)=>{
//     let consulta = Livros.find({}, (err, livro)=>{
//         if(err){
//             return res.status(500).send("Erro ao consultar livro");
//         }
//         return res.render("livros", {livros_lista:livro})
//     })
// });

app.get("/procuraLivros", (req, res) => {
    var resName = req.query.procura;
    var resAutor = req.query.procura;
    var resCategoria = req.query.procura;

    Livros.find({$or:[{nome: resName}, {autor: resAutor}, {categoria: resCategoria}]}, (err, livro)=>{
        if(err){
            return res.status(500).send("Erro ao consultar livro");
        }
        res.render("livros", {livros_lista:livro})
    })
});

//ROTA CADASTRO LIVROS
app.get("/cadastrarLivro", (req, res)=>{
    res.render("formlivro");
});


//ROTA CADASTRANDO LIVRO
app.post("/cadastrarLivro", (req, res)=>{
    livroNome = req.body.nome;
    console.log(livroNome)
    livroAutor = req.body.autor;
    livroCategoria = req.body.categoria;

        var sql = `INSERT INTO livros(nome_livro, autor_livro, genero_livro) VALUES('${livroNome}', '${livroAutor}', '${livroCategoria}')`;
        con.query(sql, function(err, result){
        if(err) throw err;
          console.log("dado inserido: " + sql);
        });
        return res.redirect("/livros");
});


// app.post("/cadastrarLivro", (req, res)=>{
//     let livro = new Livros();
    // livro.nome = req.body.nome;
    // livro.autor = req.body.autor;
    // livro.categoria = req.body.categoria;
//     livro.save((err)=>{
//         if(err){
//             return res.status(500).send("Erro ao salvar livro no BANCOD DE DADOS");
//         }
//         return res.redirect("/livros");
//     });
// });

//ROTA DELETAR LIVRO DO DB
app.get("/deletarLivro/:id", (req, res)=>{
    var del = req.params.id;

    Livros.deleteOne({_id:del}, (err)=>{
        if(err){
            return res.status(500).send("Erro ao deletar livro");
        }
        return res.redirect("/livros");
    });
});

//ROTA DE EDIÇAO
app.get("/editarLivro/:id", (req, res)=>{
    Livros.findById(req.params.id, (err, livro)=>{
        if(err){
            return res.status(500).send("Erro ao consultar livro");
        }
        return res.render("editarformlivro", {livro_item:livro})
        
    });
});

//ROTA EDITANDO LIVRO
app.post("/editarLivro", (req, res)=>{
    var id = req.body.id;
    Livros.findById(id, (err, livro)=>{
        if(err){
            return res.status(500).send("Erro ao editar livro");
        }
        livro.nome = req.body.nome;
        livro.autor = req.body.autor;
        livro.categoria = req.body.categoria;
        livro.save((err)=>{
            if(err){
                return res.status(500).send("Erro ao editar livro");
            }
            return res.redirect("/livros") 
        });
    });
})

app.listen(PORT, ()=>{
    console.log(`server running gate ${PORT}`)
});