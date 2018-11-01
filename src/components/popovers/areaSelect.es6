import Component from "../../modules/component";

export default class AreaSelect extends Component{
    constructor({pccs})
    {
        super('select.form-control', {style : 'z-index: 9999'});

        pccs.map( pcc => {
            this.context.appendChild(
                new Option(pcc.name, pcc.id)
            )
        } );
    }
}