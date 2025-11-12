// office-network.guard.spec.ts

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { OfficeNetworkGuard } from './user.guard';
// (Asumsi helper functions ipToNumber dan isIpInRange diimpor atau tersedia)

describe('OfficeNetworkGuard', () => {
    let guard: OfficeNetworkGuard;

    beforeEach(() => {
        guard = new OfficeNetworkGuard();
    });

    // Fungsi mock untuk membuat konteks eksekusi yang bisa diubah-ubah
    const mockExecutionContext = (ip: string): ExecutionContext => {
        return {
            switchToHttp: () => ({
                getRequest: () => ({
                    // Simulasi header X-Forwarded-For
                    headers: { 'x-forwarded-for': ip },
                    // Simulasi remoteAddress (sebagai fallback jika tidak ada header)
                    socket: { remoteAddress: ip },
                }),
            }),
        } as ExecutionContext;
    };

    const allowedIp = '162.120.184.27';
    const deniedIp = '192.168.1.1';

    it('seharusnya mengizinkan akses (return true) jika IP berada dalam jaringan kantor', () => {
        const context = mockExecutionContext(allowedIp);

        const result = guard.canActivate(context);

        expect(result).toBe(true);
    });
});