const get404 = (req,res) =>{
    res.status(404).render("errors/404.ejs",{
        pageTitle: "صفحه مورد نظر یافت نشد | 404",
        path : "/404",
    });
}
const get500 = (req,res) => {
    res.status(500).render("errors/500.ejs",{
        pageTitle: "خطای سرور | 500",
        path: "/404",
    })
}
module.exports = {
    get404,
    get500,
};