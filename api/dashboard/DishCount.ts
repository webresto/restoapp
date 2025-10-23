import { LineAwesomeIcon } from "sails-adminpanel/interfaces/lineAwesome";
import ActionBase from "sails-adminpanel/lib/widgets/abstractInfo";

export default class extends ActionBase {
	readonly widgetType = "info"
	async getInfo(): Promise<string> {
		return await Dish.count({isDeleted: false, concept: "origin"})+""
	}

	public icon: LineAwesomeIcon = "barcode";
	readonly id: string = 'dish-count'
	readonly department: string = 'restoapp_info'
	readonly description: string = 'Dishes'
	readonly name: string = 'Dish count'
	readonly size = {
		h: 1,
		w: 1
	}
}
