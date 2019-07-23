using backend.Data_Access.VO;

namespace backend.Logic
{
    public interface IFachadaWeb
    {
        bool userExists(string mail);
        VOUserLogin ValidUserLogin(string mail, string password);
    }
}
