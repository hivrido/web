<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!$body || !is_array($body)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

function clean(string $v): string {
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES, 'UTF-8');
}

$nombre     = clean($body['nombre']     ?? '');
$instagram  = clean($body['instagram']  ?? '');
$telefono   = clean($body['telefono']   ?? '');
$es_artista = clean($body['es_artista'] ?? '');
$dedicacion = clean($body['dedicacion'] ?? '');
$asistencia = clean($body['asistencia'] ?? '');
$motivacion = clean($body['motivacion'] ?? '');
$fecha      = clean($body['fecha']      ?? '');

if (!$nombre || !$instagram || !$telefono || !$es_artista || !$asistencia || !$motivacion) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
    exit;
}

$to      = 'hivrida@gmail.com';
$subject = '=?UTF-8?B?' . base64_encode("Nuevo registro Follow Fest — $nombre") . '?=';

$message  = "NUEVO REGISTRO — FOLLOW FEST\n";
$message .= "================================\n\n";
$message .= "Nombre:     $nombre\n";
$message .= "Instagram:  $instagram\n";
$message .= "Teléfono:   $telefono\n";
$message .= "Artista:    $es_artista\n";
$message .= "Dedicación: $dedicacion\n";
$message .= "Asistencia: $asistencia\n\n";
$message .= "Motivación:\n$motivacion\n\n";
$message .= "Enviado: $fecha\n";

$headers  = "From: HIVRIDA <noreply@hivrida.com>\r\n";
$headers .= "Reply-To: noreply@hivrida.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$sent = mail($to, $subject, $message, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'mail() failed']);
}
