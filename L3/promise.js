const fetchUserDetails = (userID) => {
    console.log("Fetching user details...");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('http://localhost/${userID}');
        }, 500);
    });
}

const downloadImage = (imageURL) => {
    console.log("Downloading image...");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Image data for ${imageURL}");
        }, 500);
    });
}

const render = (image) => {
    console.log("Render image...");
}

fetchUserDetails("Meet")
    .then((imageURL) => downloadImage(imageURL))
    .then((imageData) => render(imageData))
    .catch((error) => {
        console.log(error); 
    });