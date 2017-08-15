using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(LoginRegistration.Startup))]
namespace LoginRegistration
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
