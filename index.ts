import './style.css';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  switchMap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

/**
 * Voici une barre de recherche tout à fait classique.
 *
 * Elle doit permettre de rechercher une brasserie parmis toutes les brasseries.
 *
 * Ce catalogue de brasserie est accessible via une API ouverte (pas d'authentification).
 *
 * Voici les informations qu'on a sur l'API :
 * * URL : https://api.openbrewerydb.org/breweries
 * * Paramètre : `by_name` - permet de chercher une bière par nom. Exemple : https://api.openbrewerydb.org/breweries?by_name=Desperate
 *
 * En utilisant fromEvent, on souhaite coupler l'évenement de clavier à une recherche via API.
 * Note : utiliser https://rxjs.dev/api/ajax/ajax pour le call API.
 *
 * Pour limiter les appels HTTP on souhaite :
 * * attendre 500 ms avant d'envoyer la requête HTTP et être sur que l'utilisateur à arréter de taper.
 * * ne pas faire d'appel lorsque le champ de recherche est le même qu'avant.
 *
 * Les résutlats serront affichés via l'élement resultsEl, en modifiant le innerHTML et en séparant chaque résultat par `<br>` pour mettre à la ligne
 */

const app = document.getElementById('app');
app.innerHTML += `
<div class="wrapper">
  <h1>Real Time Search Bar</h2>
  <div class="container">
    <input id="search-bar" type="text" placeholder="eg. Big" aria-label="eg. Big" autofocus>
    <div id="results"></div>
    </div>
</div>
`;

const BASE_URL = 'https://api.openbrewerydb.org/breweries';

// elements
const searchEl = document.getElementById('search-bar');
const resultsEl = document.getElementById('results');

// streams
const input$ = fromEvent(searchEl, 'input');

input$
  .pipe(
    debounceTime(500),
    map((event) => (event.target as HTMLInputElement).value),
    distinctUntilChanged(),
    switchMap((value) =>
      ajax.getJSON<{ name: string }[]>(`${BASE_URL}?by_name=${value}`)
    )
  )
  .subscribe((results) => {
    resultsEl.innerHTML = results.map((result) => result.name).join('<br>');
  });
