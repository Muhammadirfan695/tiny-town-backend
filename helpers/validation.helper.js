exports.validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
};

exports.passwordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};
