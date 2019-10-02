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
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs-extra');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

PerformTests();

function PerformTests() {
    describe('perform license check on package.json', function() {
        this.timeout(240000);
        before(async function() {
            await exec('npm install https://github.com/ebuckle/codewind-license-checker.git');
        });
        for (const key in allPackageJsonPaths) {
            let packageJsonPath = null;
            let packageJson = null;
            let results = {};
            describe(`${key}`, function() {
                before(async function() {
                    packageJsonPath = allPackageJsonPaths[key];
                    packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
                    results = await performCheck(packageJson);
                });
                describe('examine results', function() {
                    it('should not contain uncleared licenses', function() {
                        chai.expect(results['unclearedPackages']).to.be.deep.equals({});
                    }); 
        
                    it('should not have open source unfriendly packages', function() {
                        chai.expect(results['problemPackages']).to.be.deep.equals({});
                    });
                });
            });
        }
    });
}