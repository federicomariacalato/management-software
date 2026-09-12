export type CategorySalesData = {
  category: string;
  quantity: number; //unità vendute
  fill: string; // colore della sezione del grafico, proprietà aggiunta per risolvere bug di recharts che mostra nella leggenda colori non allineati con quelli del grafico
};
