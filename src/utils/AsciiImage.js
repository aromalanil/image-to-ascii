class AsciiImage {

    constructor(imageSource, maximumWidth) {
        this.imageSource = imageSource;
        this.maximumWidth = maximumWidth;
    }

    getValue = async () => {
        return await this._generateAsciiImage();
    }

    _generateAsciiImage = () => {

        //Creating canvas and context for image manipulation
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        return new Promise((resolve, reject) => {
            const image = new Image();

            //Function to be run after image is loaded
            image.onload = () => {

                const [width, height] = this._reduceResolution(image.width, image.height);

                canvas.width = width;
                canvas.height = height;

                //Since width and height are reduced this will generate low res image
                context.drawImage(image, 0, 0, width, height);

                const grayScaleArray = this._canvasToGrayScale(context, width, height);
                resolve(this._getAsciiFromGrayScale(grayScaleArray, width));
            }
            image.onerror = reject;
            image.src = this.imageSource;
        });

    }

    _canvasToGrayScale = (context, width, height) => {

        //Getting underlying pixel data from canvas
        const imgDataObject = context.getImageData(0, 0, width, height);
        const imgData = imgDataObject.data;

        const grayScaleArray = [];

        //Traversing through pixel data, getting rgba and converting to grayscale
        for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];

            let grayScale = this._rgbToGrayScale(r, g, b);

            //Adding grayscale data to array
            grayScaleArray.push(grayScale);
        }

        return grayScaleArray;
    }

    _getAsciiFromGrayScale = (grayScaleArray, width) => {

        //70 Ascii shades of grey in descending order of intensity;
        let asciiIntensityArray = ["$", "@", "B", "%", "8", "&", "W", "M", "#", "*", "o", "a", "h", "k", "b", "d", "p", "q", "w", "m", "Z", "O", "0", "Q", "L", "C", "J", "U", "Y", "X", "z", "c", "v", "u", "n", "x", "r", "j", "f", "t", "/", "|", "(", ")", "1", "{", "}", "[", "]", "?", "-", "_", "+", "~", "<", ">", "i", "!", "l", "I", ";", ":", ",", '"', "^", "`", "'", ".", " "];
        let noOfShades = asciiIntensityArray.length;

        let asciiImage = "";

        grayScaleArray.forEach((grayScale, index) => {

            //Converting Grayscale value to corresponding ascii character
            let asciiCorrespondent = asciiIntensityArray[Math.ceil((grayScale / 255) * (noOfShades - 1))];

            //Adding new line at the end of each row traversal
            if ((index + 1) % width === 0) {
                asciiCorrespondent += "\n";
            }
            asciiImage += asciiCorrespondent+" ";
        });
        return asciiImage;
    }

    //Function to reduce image resolution based on maximumWidth
    _reduceResolution = (width, height) => {
        const maximumWidth = this.maximumWidth

        if (width > maximumWidth) {

            //Calculating new height by considering maximum width as the width
            const reducedHeight = Math.floor((height * maximumWidth) / width);
            return [maximumWidth, reducedHeight];
        }

        return [width, height];
    }

    //Function to convert rgb to corresponding grayscale number
    _rgbToGrayScale = (r, g, b) => (0.3 * r) + (0.59 * g) + (0.11 * b)
}

export default AsciiImage;