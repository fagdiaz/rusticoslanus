export class Product {
    public nombre:string="";
    public marca:string="";
    public  stock:number=0;
    public precio:number=0;
    public tipoPrenda:TipoPrenda=TipoPrenda.ninguna;
}
export enum TipoPrenda{
    ninguna,
    pantalon,
    remera,
    buzo

}