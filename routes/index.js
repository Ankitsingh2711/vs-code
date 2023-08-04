var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  var filesduo = [];
  fs.readdir('./uploads', { withFileTypes: true }, function (err, files) {
    files.forEach(function (dirents) {
      filesduo.push({ name: dirents.name, folderHai: dirents.isDirectory() })
    })
    res.render('index', { files: filesduo });
  })
  router.get("/createfile", function (req, res) {
    fs.writeFile(`./uploads/${req.query.filename}`, "", function (err) {
      if (err) { console.log(err) }
      else {
        res.redirect(`/filename/${req.query.filename}`)
      };
    })

  })
  router.get("/createfolder", function (req, res) {
    fs.mkdir(`./uploads/${req.query.foldername}`, function (err) {
      if (err) { console.log(err) }
      else {
        console.log(req.query.foldername);
        res.redirect('/');
      }
    })

  });
  router.get("/filename/:name", function (req, res) {
    var arr = [];
    fs.readdir("./uploads", { withFileTypes: true }, function (err, files) {
      files.forEach(function (elem) {
        arr.push({ name: elem.name, folderHai: elem.isDirectory() });
      })
      fs.readFile(`./uploads/${req.params.name}`, "utf8", function (err, data) {
        if (err) throw err;
        else {
          res.render("indexUtil", { files: arr, filename: req.params.name, data });
        }
      })
    })
  })
  router.get(`/delete/:filename`, (req, res) => {
    if ((req.params.filename).split('.')[1]) {
      fs.unlink(`./uploads/${req.params.filename}`, err => {
        if (err) throw err;
        res.redirect('/');
      })
    } else {
      fs.rmdir(`./uploads/${req.params.filename}`, err => {
        if (err) throw err;
        res.redirect('/');
      })
    }
  })

});

module.exports = router;
