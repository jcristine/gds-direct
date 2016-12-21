"use strict";

// function availableFormats()
// {
// 	let container = document.createElement('div');
//
// 	container.innerHTML = `
// 	<div class="text-center heading">Availability formats</div>
//
// 	<table class="table">
// 		<thead>
// 			<tr>
// 				<th>Apollo</th>
// 				<th>Sabre</th>
// 			</tr>
// 		</thead>
// 		<tr>
// 			<td>asdsad sa</td>
// 			<td> adssa d sa</td>
// 		</tr>
// 	</table>`;
//
// 	return container;
// }
//
//
// let section = document.createElement('section');
// let ul 		= document.createElement('ul');
//
// ul.className = 'list';
//
// ul.appendChild( createList({
// 	name : 'Pcc & product Info',
// 	text : 'bla bal bal'
// }) );
//
// ul.appendChild( createList({
// 	name : 'Tariff display formats',
// 	text : 'bla bal bal'
// }) );
//
// ul.appendChild( availableFormats() );
//
// ul.appendChild( createList({
// 	name : 'Sell seats',
// 	text : 'bla bal bal'
// }) );
//
// ul.appendChild( createList({
// 	name : 'Pricing formats',
// 	text : 'bla bal bal'
// }) );
//
// sideMenu.appendChild( ul );


import { INFO_DATA_URL } from '../constants.js';
import Requests from '../helpers/requests';

let SideMenu = (function()
{
	let ul, sideMenu = document.createElement('aside');

	function createList( params = {} )
	{
		let button = document.createElement('button');
		button.className = 'js-collapse btn btn-white btn-block';
		button.innerHTML = params.name;

		let container = document.createElement('div');
		container.innerHTML		= params.text;
		container.className 	= 'm-t-sm';
		container.style.display = 'none';

		let hidden = true;
		button.addEventListener('click', () => {
			hidden = !hidden;
			container.style.display = hidden ? 'none' : '';
		});

		let li = document.createElement('li');
		li.appendChild( button );
		li.appendChild( container );

		return li;
	}

	function getData()
	{
		Requests.get( INFO_DATA_URL ).then(( response ) => {
			response.data.map(function ( obj ) {
				ul.appendChild( createList({
					name : obj.name,
					text : obj.info,
				}));
			});

			sideMenu.appendChild( ul );
		});
	}

	return {

		render()
		{
			ul 		= document.createElement('ul');
			ul.className = 'list';

			getData();
			return sideMenu
		}
	}
}());

export default  {
	render : SideMenu.render
};