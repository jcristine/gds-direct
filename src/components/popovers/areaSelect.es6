import Component from "../../modules/component";

export default class AreaSelect extends Component{
    constructor({defaultPcc, pccs})
    {
        super('select.form-control', {style : 'z-index: 9999'});

        this.context.appendChild(
            new Option('Not selected', '0')
        );

        pccs.map( pcc => {
            this.context.appendChild(
                new Option(pcc.name, pcc.id, pcc.name === defaultPcc, pcc.name === defaultPcc)
            )
        } );
    }
}