namespace backend.Logica
{
    public class FabricaFachadas
    {
        public FabricaFachadas() { }

        public IFachadaWeb CrearFachadaWEB { get { return new Fachada(); } }
    }
}
