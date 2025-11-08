import {InstallStepper} from "./installStepper/installStepper";

InstallStepper.getInstance();

declare const sails: any;

export default function() {

    const installStepperPolicy = function (req: any, res: any, proceed: ()=>void) {
        if (!req.user && !req.user) {
            // console.log("No UserAP session and no req.user, proceeding");
            return proceed();
        }

		const activeStepper = getActiveStepper();
		// console.log("Active stepper:", activeStepper ? activeStepper.id : "null");
		if (!activeStepper) {
			// console.log("No active stepper, proceeding");
			return proceed();
		}
		const routePrefix = normalizeRoutePrefix(sails.config.adminpanel.routePrefix || "/admin");
		const requestPath = getRequestPathname(req);
		// console.log("Route prefix:", routePrefix, "Request path:", requestPath);

		if (!requestPath.startsWith(routePrefix)) {
			// console.log("Request path doesn't start with route prefix, proceeding");
			return proceed();
		}

		const isAllowed = isAllowedDuringInstall(requestPath, routePrefix, activeStepper.id);
		// console.log("Is allowed during install:", isAllowed);
		if (isAllowed) {
			// console.log("Request is allowed during install, proceeding");
			return proceed();
		}

		const redirectUrl = `${routePrefix}/install/${activeStepper.id}`;
		// console.log("Redirecting to:", redirectUrl);
		return res.redirect(redirectUrl);
    };

    if (Array.isArray(sails.config.adminpanel.policies) && typeof sails.config.adminpanel.policies[0] !== "string") {
        if (!sails.config.modulemanager.state.installStepperPolicyBound) {
            // @ts-ignore
			// console.log(">>>>>", sails.config.adminpanel.policies)
            sails.config.adminpanel.policies.push(installStepperPolicy);
            sails.config.modulemanager.state.installStepperPolicyBound = true;
        }
    } else {
        sails.log.error("Can not bind install stepper. Policies is not array");
    }
};

function getActiveStepper(): InstallStepper | null {
	// console.log("InstallStepper.instances:", InstallStepper.instances.map(s => ({ id: s.id, hasUnprocessed: s.hasUnprocessedSteps(), hasUnfinalized: s.hasUnfinalizedSteps() })));
	const realStepper = InstallStepper.instances.find(stepper => stepper.hasUnprocessedSteps() || stepper.hasUnfinalizedSteps());
	if (realStepper) {
		// console.log("Found real stepper:", realStepper.id);
		return realStepper;
	}

	// console.log("No active stepper found");
	return null;
}



function normalizeRoutePrefix(routePrefix: string): string {
	if (!routePrefix) {
		return "/admin";
	}
	if (!routePrefix.startsWith("/")) {
		routePrefix = `/${routePrefix}`;
	}
	if (routePrefix.length > 1 && routePrefix.endsWith("/")) {
		routePrefix = routePrefix.slice(0, -1);
	}
	return routePrefix;
}

function getRequestPathname(req: any): string {
	if (req._parsedUrl?.pathname) {
		return req._parsedUrl.pathname;
	}
	try {
		return new URL(req.url, `http://${req.headers.host}`).pathname;
	} catch (e) {
		return req.url || "";
	}
}

function isAllowedDuringInstall(pathname: string, routePrefix: string, stepperId: string): boolean {
	const installPath = `${routePrefix}/install/${stepperId}`;
	if (pathname === installPath || pathname.startsWith(`${installPath}/`)) {
		return true;
	}

	const allowedStaticPrefixes = [
		`${routePrefix}/assets/`,
		`${routePrefix}/modules/assets/`,
		`${routePrefix}/images/`,
		`${routePrefix}/fonts/`,
		`${routePrefix}/js/`,
		`${routePrefix}/css/`
	];
	if (allowedStaticPrefixes.some(prefix => pathname.startsWith(prefix))) {
		return true;
	}

	const staticExtensions = [".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".map", ".json"];
	if (staticExtensions.some(ext => pathname.toLowerCase().endsWith(ext))) {
		return true;
	}

	return false;
}
