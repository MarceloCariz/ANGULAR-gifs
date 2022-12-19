import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gifs, SearchGifsResponse } from '../interfaces/gif.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey:string = 'Vb6yI84dtEvTxR0OCMrvpvjgGjfQB3nw';
  private _historial:string[] = [];
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'
  public resultados: Gifs[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient){ // lugar ideal para cargar el localstorage
    const existe = localStorage.getItem("historial");
    const resultado = localStorage.getItem("resultado");
    if(existe || resultado){
      this._historial = JSON.parse(existe!) || [];
      this.resultados = JSON.parse(resultado!) || [];
    }
  }

  buscarGifs(query:string = ''){/// query = palabra que se busca ej: goku
    const queryLowerCase = query.toLocaleLowerCase()
    const existe = this.historial.includes(queryLowerCase);

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query);
    

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params})
                          .subscribe((resp) =>{ 
                            this.resultados =  resp.data;
                            localStorage.setItem('resultado',JSON.stringify(resp.data));
                          });
    if(existe) return console.log('Ya existe');
    this._historial.unshift(queryLowerCase);
    this._historial = this._historial.splice(0,10);
    localStorage.setItem("historial", JSON.stringify(this._historial));
  }
}
