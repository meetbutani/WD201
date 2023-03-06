const time = async (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

const fetchUserDetails = async (userID) => {
    console.log("Fetching user details...");
    await time(500);
    return ('http://localhost/${userID}');
}

const downloadImage = async (imageURL) => {
    console.log("Downloading image...");
    await time(500);
    return "Image data for ${imageURL}";
}

const render = async (image) => {
    await time(300);
    console.log("Render image...");
}

const run = async () => {
    const imageURL = await fetchUserDetails("Meet");
    const imageData = await downloadImage(imageURL);
    await render(imageData);
};

run();