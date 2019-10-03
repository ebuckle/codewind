/* eslint-disable no-loop-func */
/*******************************************************************************
 * Copyright (c) 2019 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
*******************************************************************************/

const performCheck = require('codewind-license-checker').performCheck;
const allPackageJsonPaths = require('../config/index').packageJsons;
const fs = require('fs-extra');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

describe('perform license check on package.json', function() {
    this.timeout(240000);
    before(async function() {
        // Update for new eclipse data and whitelist
        await exec('npm install https://github.com/ebuckle/codewind-license-checker.git');
    });
    for (const key in allPackageJsonPaths) {
        let packageJsonPath = null;
        let packageJson = null;
        let results = {};
        describe(`${key}`, async function() {
            packageJsonPath = allPackageJsonPaths[key];
            packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
            results = await performCheck(packageJson);
            delete results.acceptedPackages;
            console.log(results);
        });
    }
});