const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
};

const passwordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};


module.exports = {
    validatePassword,
    passwordsMatch
}