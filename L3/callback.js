const fetchUserDetails = (userID, callback) => {
    console.log("Fetching user details...");
    setTimeout(() => {
        callback('http://localhost/${userID}');
    }, 500);
}

const downloadImage = (imageURL, callback) => {
    console.log("Downloading image...");
    setTimeout(() => {
        callback("Image data for ${imageURL}");
    }, 500);
}

const render = (image) => {
    console.log("Render image...");
}

fetchUserDetails("meet", (imageURL) => {
    downloadImage(imageURL, (imageData) => {
        render(imageData);
    })
});

// This type of pyramid stucture is call callback hell