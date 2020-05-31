const URL = "https://teachablemachine.withgoogle.com/models/EnLWflQ9u/";
let model, webcam, labelContainer, maxPredictions;
// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    
    document.getElementById("loading").innerHTML = "Loading...";
    var button = document.getElementById("button")
    button.parentNode.removeChild(button);
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    document.getElementById("loading").innerHTML = "";
    window.requestAnimationFrame(loop);
    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("li"));
    }
}
async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}
// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    let classPrediction, tempPP, predictionProb
    for (let i = 0; i < maxPredictions; i++) {
        // tempPP = Array(prediction[i].probability.toFixed(2)*100); predictionProb = tempPP.sort((a,b) => b-a);
        classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2)*100 + "%";        
        
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}