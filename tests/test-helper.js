import Application from 'dummy/app';
import config from 'dummy/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

import QUnit from 'qunit';
import { installWaitFor } from 'qunit-wait-for';

installWaitFor(QUnit);

setApplication(Application.create(config.APP));

start();
