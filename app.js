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


//ROTA DELETAR LIVRO DO DB
app.get("/deletarLivro/:id", (req, res)=>{
    var id = req.params.id;
    var sql = `DELETE FROM livros WHERE id_livro = ?`;
    con.query(sql, [id], function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + sql);
    });
    return res.redirect("/livros");

});


//ROTA DE EDIÇAO
app.get("/editarLivro/:id", (req, res)=>{
    var UserId = req.params.id;
    var sql = `SELECT * FROM livros WHERE id_livro= ${UserId}`;
    con.query(sql, function (err, rows) {
        if (err) throw err;
        console.log("Number of records update: " + sql);
        return res.render("editarformlivro", {livro_item:rows[0]})
    });  
});


//ROTA EDITANDO LIVRO
app.post("/editarLivro", (req, res)=>{
    var id = req.body.id_livro;
    var updateData= req.body;
    var sql = `UPDATE livros SET ? WHERE id_livro= ?`;
    con.query(sql, [updateData, id], function (err, data) {
        if (err) throw err;
        console.log(data.affectedRows + " record(s) updated");
      });
      res.redirect('/livros');
 });

app.listen(PORT, ()=>{
    console.log(`server running gate ${PORT}`)
});