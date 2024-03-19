const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const sizes = ['4x4', '5x5', '6x6', '7x7', '8x8', '9x9', '10x10'];
const prices = {
    '4x4': 500,
    '5x5': 500,
    '6x6': 500,
    '7x7': 500,
    '8x8': 500,
    '9x9': 700,
    '10x10': 900
};

const processFolder = (folderPath) => {
    // Leer los nombres de los archivos en la carpeta
    const files = fs.readdirSync(folderPath).filter(file => path.extname(file).toLowerCase() === '.png');
    const products = [];

    files.forEach(file => {
        const fileName = path.basename(file, '.png').split('_');
        const productName = fileName[1];
        const category = fileName[0];

        if (category === 'VIBES') return;

        sizes.forEach(size => {
            const price = prices[size];
            const dimensions = size.split('x');
            const product = {
                Nombre: productName,
                Stock: '', // O el valor que necesites
                SKU: '',
                Precio: price,
                'Precio Oferta': '',
                'Nombre Atributo 1': 'Tamaño',
                'Valor Atributo 1': size,
                'Nombre Atributo 2': '',
                'Valor Atributo 2': '',
                'Nombre Atributo 3': '',
                'Valor Atributo 3': '',
                Categorías: `CALCOS > ${category}`,
                Peso: '0.5', // Asumiendo que el peso es el mismo para todos
                Alto: dimensions[0],
                Ancho: dimensions[1],
                Profundidad: '1', // Asumiendo que la profundidad es la misma para todos
                'Mostrar En Tienda': 'Si',
                Descripción: ''
                // Asegúrate de reemplazar esto con la descripción real
            };
            products.push(product);
        });
    });

    return products;
};

// Reemplazar 'pathToImages' con la ruta real de tu carpeta de imágenes
const pathToImages = "./fotos";
const folders = fs.readdirSync(pathToImages).filter(folder => fs.statSync(path.join(pathToImages, folder)).isDirectory());

let allProducts = [];

folders.forEach(folder => {
    const folderPath = path.join(pathToImages, folder);
    const products = processFolder(folderPath);
    allProducts = allProducts.concat(products);
});

console.log(allProducts)

// Convertir a hoja de cálculo y guardar
const worksheet = xlsx.utils.json_to_sheet(allProducts);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Productos');

//// Reemplaza 'output.xlsx' con la ruta y el nombre de archivo donde deseas guardar el Excel
xlsx.writeFile(workbook, './output.xlsx');

//console.log('Procesamiento completado, archivo guardado como output.xlsx');
