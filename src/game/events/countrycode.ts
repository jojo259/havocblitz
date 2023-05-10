import { Event } from "./event";
import { Player } from "../entities/player";
import { entityList } from "../entitymanager";

export class CountryCode extends Event {

	countryCode: string;

	constructor (countryCode: string) {
		super("CountryCode");
		this.countryCode = countryCode;
	}

	static doEvent(json: any): void {
		entityList.forEach(entity => {
			if (entity instanceof Player) {
				if (entity.id == json.peerId) {
					entity.setCountryCodeAndFlag(json.countryCode);
				}
			}
		});
	}
}
