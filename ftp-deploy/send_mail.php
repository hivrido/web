<?php
header('Content-Type: application/json; charset=utf-8');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Leer JSON del body
$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!$body || !is_array($body)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

// Sanitizar entrada
function clean($v) {
    return htmlspecialchars(strip_tags(trim((string)$v)), ENT_QUOTES, 'UTF-8');
}

$nombre     = clean($body['nombre']     ?? '');
$instagram  = clean($body['instagram']  ?? '');
$telefono   = clean($body['telefono']   ?? '');
$es_artista = clean($body['es_artista'] ?? '');
$dedicacion = clean($body['dedicacion'] ?? '');
$asistencia = clean($body['asistencia'] ?? '');
$motivacion = clean($body['motivacion'] ?? '');
$fecha      = clean($body['fecha']      ?? '');

// Validar campos requeridos
if (!$nombre || !$instagram || !$telefono || !$es_artista || !$asistencia || !$motivacion) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
    exit;
}

// Destinatario
$to = 'hivrida@gmail.com';

// Asunto con UTF-8
$subject = '=?UTF-8?B?' . base64_encode("Nuevo registro Follow Fest — $nombre") . '?=';

// Cuerpo del mail
$msg  = "NUEVO REGISTRO — FOLLOW FEST\n";
$msg .= "================================\n\n";
$msg .= "Nombre:      $nombre\n";
$msg .= "Instagram:   $instagram\n";
$msg .= "Teléfono:    $telefono\n";
$msg .= "Artista:     $es_artista\n";
$msg .= "Dedicación:  $dedicacion\n";
$msg .= "Asistencia:  $asistencia\n\n";
$msg .= "Motivación:\n$motivacion\n\n";
$msg .= "Enviado:     $fecha\n";

// Headers
$headers  = "From: HIVRIDA <noreply@hivrida.com>\r\n";
$headers .= "Reply-To: noreply@hivrida.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$sent = mail($to, $subject, $msg, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'mail() failed']);
}
