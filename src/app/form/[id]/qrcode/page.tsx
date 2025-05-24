'use client';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRCodePage(url: string) {
    return (
    <div id="qrcode">
            <QRCodeCanvas value={url} size={512} bgColor="#FFFFFF" fgColor="#000000" />
    </div>


)}