namespace backend.Logic
{
    public class FacadeFactory
    {
        public FacadeFactory() { }

        public IFacadeWeb CreateFacadeWeb { get { return new Facade(); } }
    }
}
