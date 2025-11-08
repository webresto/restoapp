/**
 * Calls function once in debounceTime for every specific parameter
 * */
export default function debounceByParam(debounceTime: number) {
	const debounceMap: Record<string, NodeJS.Timeout> = {};

	return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor) {
		let originalMethod;
		if (descriptor) {
			originalMethod = descriptor.value;
		} else {
			originalMethod = target[propertyKey];
		}

		const debounced = function (...args: any[]) {
			const param = args[0]; // first argument is used like parameter for debounce

			if (debounceMap[param]) {
				clearTimeout(debounceMap[param]);
			}

			debounceMap[param] = setTimeout(() => {
				originalMethod.apply(this, args);
				delete debounceMap[param];
			}, debounceTime);
		};

		if (descriptor) {
			descriptor.value = debounced;
			return descriptor;
		} else {
			target[propertyKey] = debounced;
		}
	};
}
