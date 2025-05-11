<?php

namespace App\Http\Controllers\Global;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ReverseGmapsUrl extends Controller
{
    private function getRedirectUrl($maps_url)
    {
        $response = Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        ])->get($maps_url);

        if ($response->successful()) {
            return $response->effectiveUri();
        }

        return null;
    }

    private function getGeoLocation($full_maps_url)
    {
        $pattern = '/@(-?\d+\.\d+),(-?\d+\.\d+)/';
        if (preg_match($pattern, $full_maps_url, $matches)) {
            return [
                'latitude' => $matches[1],
                'longitude' => $matches[2],
            ];
        }

        return null;
    }

    public function reverseGmapsUrl(Request $request)
    {
        $maps_url = $request->input('url');

        if (empty($maps_url)) {
            return response()->json(
                [
                    'error' => 'URL tidak boleh kosong',
                ],
                400,
            );
        }

        if (!filter_var($maps_url, FILTER_VALIDATE_URL)) {
            return response()->json(
                [
                    'error' => 'URL tidak valid',
                ],
                400,
            );
        }

        if (!preg_match('/^https:\/\/maps\.app\.goo\.gl\/[a-zA-Z0-9]+$/', $maps_url)) {
            return response()->json(
                [
                    'error' => 'URL harus berupa short URL Google Maps yang valid.',
                ],
                400,
            );
        }

        $redirect_url = $this->getRedirectUrl($maps_url);
        $geo_location = $this->getGeoLocation($redirect_url);
        if ($geo_location) {
            return response()->json(
                [
                    'latitude' => $geo_location['latitude'],
                    'longitude' => $geo_location['longitude'],
                ],
                200,
            );
        }
    }
}
