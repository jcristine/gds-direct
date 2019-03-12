import Component from "../../modules/component";

export default class PccSelect extends Component{
    constructor({defaultPcc, pccs, disabled})
    {
        super('select.form-control default-pcc', {style : 'z-index: 9999'});

        let notSelectedMsg = 'Not selected';
        if (disabled) {
            this.getContext().setAttribute('disabled', 'disabled');
            notSelectedMsg = 'Home PCC';
        }

        this.context.appendChild(
            new Option(notSelectedMsg, '')
        );

        pccs.map( pcc => {
            this.context.appendChild(
                new Option(pcc.name + " - " + pcc.consolidatorName, pcc.name, pcc.name === defaultPcc, pcc.name === defaultPcc)
            )
        } );
    }
}