import Component from "../../modules/component";

export default class AreaSelect extends Component{
    constructor({defaultPcc, pccs})
    {
        super('select.form-control default-pcc', {style : 'z-index: 9999'});

        this.context.appendChild(
            new Option('Not selected', '')
        );

        pccs.map( pcc => {
            this.context.appendChild(
                new Option(pcc.name + " - " + pcc.consolidatorName, pcc.name, pcc.name === defaultPcc, pcc.name === defaultPcc)
            )
        } );
    }
}