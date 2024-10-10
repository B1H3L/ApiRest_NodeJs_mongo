const express = require ('express')
const router = express.Router()
const Book = require('../models/book.models')


//Middleware
const getBook = async (req,res,next)=>{
    let book;
    const {id}= req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message: 'El Id no es valido'
        }
    )
    }

    try{
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json({
                message : 'Libro no encontrado'
            })
        }
    }catch(error){
        return res.status(500).json({ message : error.message})

    }

    res.book = book;
    next()
}
//obteniendo todos los libros
router.get('/',async(req,res)=>{
try{
    const books =  await Book.find();
    console.log('GET ALL', books)

    if(books.length === 0){
        return  res.status(204).json([])
    }

    res.json(books)

}catch(error){
    res.status(500).json({message: error.message})
}
})

//creando un nuevo libro

router.post('/',async(req,res)=>{
    const{ title,author,genere,publicationDate} = req?.body
    if(!title || !author || !genere || !publicationDate){
        return res.status(400).json({
            messages: 'Los campos son olbigatorios'
        })
    }

    const book = new Book(
    {
        title,
        author,
        genere,
        publicationDate
    }
    )

    try{
        const newBook = await book.save()
        console.log(newBook)
        res.status(201).json(newBook)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

//obteniendo un libro por el id
router.get('/:id',getBook,async(req,res)=>{
    res.json(res.book)
})

//actulizando libro
router.put('/:id',getBook,async(req,res)=>{
try {
    const book = res.book
    book.title = req.body.title || book.title;
    book.author = req.body.author  || book.author;
    book.genere = req.body.genere|| book.genere;
    book.publicationDate = req.body.publicationDate || book.publicationDate;

    const updatedBook = await book.save()
    res.json(updatedBook)

} catch (error) {
    res.status(400).json({message: error.message})
    
}
})

//actualizando libro con patch
router.patch('/:id',getBook,async(req,res)=>{
    if(!req.body.title && !req.body.author && !req.body.genere && !req.body.publicationDate){
        res.status(400).json(
            { message: 'Al menos un campo es obligatorio'}
        )
    }
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author  || book.author;
        book.genere = req.body.genere|| book.genere;
        book.publicationDate = req.body.publicationDate || book.publicationDate;
    
        const updatedBook = await book.save()
        res.json(updatedBook)
    
    } catch (error) {
        res.status(400).json({message: error.message})
        
    }
    })

    //Eliminado libro

    router.delete('/:id',getBook,async(req,res)=>{
       try {
        const  book = res.book
        await res.book.deleteOne({
            _id: book._id
        });
        res.json({
            messages: 'Libro eliminado correctamente'
        })
       } catch (error) {

        res.status(500).json({message: error.message})
        
       }
    })
    





module.exports = router