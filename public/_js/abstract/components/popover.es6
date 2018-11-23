import App from 'application';

export class PopoverBs
{
	constructor({props, trigger, context, ...params})
	{
		const Context = App.components.create('div')
			.append(this.closeButton(params.onClose))
			.append(context);

		const defaults = {
			html		: true,
			container	: 'body',
			content		: Context.getContext()
		};

		this._inst = $(trigger).popover({...defaults, ...props});

		if (params.onClose)
		{
			this._inst.on('hide.bs.popover', params.onClose);
		}

		if (params.autoOpen)
		{
			this._inst.popover('toggle');
		}
	}

	closeButton()
	{
		return App.Dom('span.btn btn-xs btn-white close-rounded[&times;]', {
			onclick	: () => this.hide()
		})
	}

	open()
	{
		this._inst.popover('show');
	}

	hide()
	{
		this._inst.popover('hide');
	}

	destroy()
	{
		this._inst.popover('destroy');
	}

	getSelf()
	{
		return this._inst;
	}
}