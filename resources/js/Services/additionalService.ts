export const currentTime = () => {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 5 && hours < 12) {
        return "Pagi 🌤️";
    } else if (hours >= 12 && hours < 17) {
        return "Siang 🌞";
    } else if (hours >= 17 && hours < 18) {
        return "Sore ⛅";
    } else {
        return "Malam 🌙";
    }
};

export const currentTimeCode = () => {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 5 && hours < 12) {
        return "M";
    } else if (hours >= 12 && hours < 17) {
        return "A";
    } else if (hours >= 17 && hours < 18) {
        return "E";
    } else {
        return "N";
    }
};
