'use strict';

const assert = require('assert');
const Host = require('../app/src/host');

describe('test-Host', () => {
    let host;

    beforeEach(() => {
        host = new Host();
    });

    describe('1. getIP', () => {
        it('should return IP from x-forwarded-for header', () => {
            const req = {
                headers: { 'x-forwarded-for': '1.1.1.1' },
                socket: {},
            };
            assert.strictEqual(host.getIP(req), '1.1.1.1');
        });

        it('should return IP from X-Forwarded-For header', () => {
            const req = {
                headers: { 'X-Forwarded-For': '2.2.2.2' },
                socket: {},
            };
            assert.strictEqual(host.getIP(req), '2.2.2.2');
        });

        it('should return IP from socket.remoteAddress if headers are missing', () => {
            const req = {
                headers: {},
                socket: { remoteAddress: '3.3.3.3' },
            };
            assert.strictEqual(host.getIP(req), '3.3.3.3');
        });

        it('should return IP from req.ip if headers and socket are missing', () => {
            const req = {
                headers: {},
                socket: {},
                ip: '4.4.4.4',
            };
            assert.strictEqual(host.getIP(req), '4.4.4.4');
        });
    });

    describe('2. Authorized IPs management', () => {
        it('should initially have no authorized IPs', () => {
            assert.deepStrictEqual(host.getAuthorizedIPs(), {});
        });

        it('should set and get authorized IPs', () => {
            host.setAuthorizedIP('127.0.0.1', true);
            assert.deepStrictEqual(host.getAuthorizedIPs(), { '127.0.0.1': true });
        });

        it('should check if an IP is authorized', () => {
            assert.strictEqual(host.isAuthorizedIP('127.0.0.1'), false);
            host.setAuthorizedIP('127.0.0.1', true);
            assert.strictEqual(host.isAuthorizedIP('127.0.0.1'), true);
        });

        it('should delete an IP from authorized IPs', () => {
            host.setAuthorizedIP('127.0.0.1', true);
            assert.strictEqual(host.isAuthorizedIP('127.0.0.1'), true);
            assert.strictEqual(host.deleteIP('127.0.0.1'), true);
            assert.strictEqual(host.isAuthorizedIP('127.0.0.1'), false);
            assert.deepStrictEqual(host.getAuthorizedIPs(), {});
        });

        it('should return false when deleting a non-existent IP', () => {
            assert.strictEqual(host.deleteIP('192.168.1.1'), false);
        });
    });
});
