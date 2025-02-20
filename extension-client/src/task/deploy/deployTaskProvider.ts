/**
 * IBM Cloud Schematics
 * (C) Copyright IBM Corp. 2021 All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';

import DeployTaskTerminal from './deployTaskTerminal';

export class DeployTaskProvider implements vscode.TaskProvider {
    static taskType = 'ibmcloud-schematics-deploy';

    private taskName = 'deploy';
    private taskSource = 'schematics';
    private taskDefinition = {
        type: DeployTaskProvider.taskType,
    };

    private tasks: vscode.Task[] | undefined;

    constructor() {}

    public async provideTasks(): Promise<vscode.Task[]> {
        return this.getTasks();
    }

    public resolveTask(_task: vscode.Task): vscode.Task | undefined {
        return undefined;
    }

    private getTasks(): vscode.Task[] {
        if (this.tasks !== undefined) {
            return this.tasks;
        }

        this.tasks = [];
        this.tasks!.push(this.getDeployTask());
        return this.tasks;
    }

    private getDeployTask(): vscode.Task {
        var execution = new vscode.CustomExecution(
            async (): Promise<vscode.Pseudoterminal> => new DeployTaskTerminal()
        );
        var problemMatchers = ['$myProblemMatcher'];
        return new vscode.Task(
            this.taskDefinition,
            vscode.TaskScope.Workspace,
            this.taskName,
            this.taskSource,
            execution,
            problemMatchers
        );
    }
}
