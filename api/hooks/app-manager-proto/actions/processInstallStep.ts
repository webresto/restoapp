import {InstallStepper} from "../lib/installStepper/installStepper";
import * as path from "path";
import * as ejs from "ejs";

export default async function processInstallStep(req: any, res: any): Promise<void> {
	console.log(req.user)
	if (req.adminizer.config.auth.enable) {
        if (!req.user) {
            return req.Inertia.redirect(`${req.adminizer.config.routePrefix}/model/userap/login`);
        } else if (!req.adminizer.accessRightsHelper.hasPermission(`process-install-step`, req.user)) {
            return res.sendStatus(403);
        }
    }

	if (req.method.toUpperCase() === 'GET') {
		let installStepper = InstallStepper.getStepper(req.params.id);
		if (!installStepper) {
			res.redirect(`${req.adminizer.config.routePrefix}`);
			return
		}

		if (installStepper.hasUnprocessedSteps() || installStepper.hasUnfinalizedSteps()) {
			let renderData = installStepper.render(req.user.locale);
			let renderer = renderData.currentStep.renderer;
			console.log("Renderer:", renderer, "Step ID:", renderData.currentStep.id);
			
			// run onInit method before showing step to user (if it exists)
			try {
				if (typeof renderData.currentStep.onInit === 'function') {
					await renderData.currentStep.onInit();
				}
			} catch (e) {
				console.log("ERROR IN PROCESS INSTALL STEP", e)
				const errorData = {
					error: e, 
					stepperId: installStepper.id,
					__: (key: string) => key // Simple fallback function
				};
				const html = await ejs.renderFile(path.join(__dirname, '../views/installer/error.ejs'), errorData);
				res.send(html);
				return
			}

			// Use "ejs" template for EJS renderer, otherwise use the renderer name as template
			let templateName = renderer === 'ejs' ? 'ejs' : renderer;
			
			// Add translation function for EJS templates
			const templateData = {
				...renderData, 
				stepperId: installStepper.id,
				__: (key: string) => key // Simple fallback function that returns the key as-is
			};
			
			const html = await ejs.renderFile(path.join(__dirname, `../views/installer/${templateName}.ejs`), templateData);
			res.send(html);
			return
		} else {
			res.redirect(`${req.adminizer.config.routePrefix}`);
			return
		}
	}

	if (req.method.toUpperCase() === 'POST') {

		try {
			console.log("POST REQUEST TO PROCESS INSTALL STEP", req.body)
			console.log("Request headers:", req.headers)
			console.log("Request action:", req.body.action)
			let installStepper = InstallStepper.getStepper(req.params.id);

			const currentStepId = req.body.currentStepId;
			const filesCounter = req.body.filesCounter;

			// upload files before processing other fields (filesCounter > 0 means that req contains files)
			let uploadedFiles = [];
			
			// Handle uploaded files (multer puts them in req.files)
			if (req.files && Array.isArray(req.files) && req.files.length > 0) {
				console.log(`Processing ${req.files.length} uploaded files`);
				for (const file of req.files) {
					try {
						// Move file to final location and get path
						const uploadedFile = await processUploadedFile(file, currentStepId);
						uploadedFiles.push(uploadedFile);
					} catch (error) {
						console.error('Error processing uploaded file:', error);
					}
				}
			} else if (filesCounter && filesCounter > 0) {
				console.warn(`Files counter is ${filesCounter} but no files found in request. This may happen with JSON requests.`);
			}

			const action = req.body.action;
			console.log("Action type:", typeof action, "Action value:", action);
			
			if (action === 'next') {
				let inputData;
				try {
					inputData = typeof req.body.inputData === 'string' ? JSON.parse(req.body.inputData) : req.body.inputData;
				} catch (e) {
					console.error("Failed to parse inputData:", e);
					inputData = {};
				}
				
				if (uploadedFiles.length) {
					inputData.uploadedFiles = uploadedFiles;
				}

				// trying to process step
				await installStepper.processStep(currentStepId, inputData);

			} else if (action === 'skip') {
				// trying to skip step
				await installStepper.skipStep(currentStepId);

			} else {
				console.error("Invalid action:", action, "Available actions: 'next', 'skip'");
				res.status(400).send(`Invalid action parameter: ${action}. Expected: 'next' or 'skip'`);
				return
			}

			// go back to stepper if there are more unprocessed steps, otherwise go back to /admin
			if (installStepper.hasUnprocessedSteps()) {
				res.redirect(`${req.adminizer.config.routePrefix}/install/${installStepper.id}`);
				return
			} else {
				res.redirect(`${req.adminizer.config.routePrefix}`);
				return
			}

		} catch (error) {
			console.error("Error processing step:", error);
			res.status(500).send("Error processing step");
			return
		}
	}

	if (req.method.toUpperCase() === 'DELETE') {
		console.log("DELETE REQUEST TO PROCESS INSTALL STEP", req.body)

		try {
			InstallStepper.deleteStepper(req.params.id);
			res.status(200).send("OK")
			return
		} catch (e) {
			res.status(403).send(e);
			return
		}
	}

	res.status(500).send("Invalid request method")
	return
};

function uploadFiles(files: any, currentStepId: string | number) {
	// TODO: Investigate system hang when trying to save a file, and execution of the code after save block does not process.
	//  The system seems to only proceed after encountering a timeout error.
	//  This issue is ruining the ability to upload multiple files.

	return new Promise((resolve, reject) => {
		files.upload({
			dirname: `installStepper/uploadedImages`,
			maxBytes: 100000000,
			saveAs: function (file: any, cb: any) {
				const extension = path.extname(file.filename);
				const baseName = path.basename(file.filename, path.extname(file.filename));
				const uniqueName = `${currentStepId}_${baseName}_${Date.now()}${extension}`;
				cb(null, uniqueName);
			}
		}, (err: any, uploadedFiles: any) => {
			if (err) {
				console.error(err);
				reject(err);

			} else if (uploadedFiles && uploadedFiles.length > 0) {
				const uploadedFile = uploadedFiles[0];
				const uploadedFileName = uploadedFile.fd;
				console.log("DOWNLOADED FILE", uploadedFileName);
				resolve(uploadedFileName);

			} else {
				reject(new Error("No files were uploaded"));
			}
		});
	});
}

async function processUploadedFile(file: any, currentStepId: string | number): Promise<string> {
	const fs = require('fs');
	
	// Create target directory if it doesn't exist
	const targetDir = path.join(process.cwd(), 'installStepper', 'uploadedImages');
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}
	
	// Generate unique filename
	const extension = path.extname(file.originalname);
	const baseName = path.basename(file.originalname, extension);
	const uniqueName = `${currentStepId}_${baseName}_${Date.now()}${extension}`;
	const finalPath = path.join(targetDir, uniqueName);
	
	// Move file from temp location to final location
	fs.renameSync(file.path, finalPath);
	
	console.log("PROCESSED FILE", finalPath);
	return finalPath;
}
