const createGoogleMapsLink = (address) => {
    const baseUrl = 'https://www.google.com/maps/search/';
    return `${baseUrl}${encodeURIComponent(address)}`;
};

module.exports = { createGoogleMapsLink };
