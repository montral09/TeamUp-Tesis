namespace backend.Logic
{
    public class FabricaFachadas
    {
        public FabricaFachadas() { }

        public IFachadaWeb CrearFachadaWEB { get { return new Fachada(); } }
    }
}
