#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ESP32Servo.h>

// Configuración WiFi y MQTT
const char* ssid = "AbrahanMV";
const char* password = "Yomero20";
const char* mqtt_server = "6a2e20f80d0345088d4d4b7f8a0e3097.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "hivemq.webclient.1742277525146";
const char* mqtt_password = "NkO.?p1,2e0VrAB$6abK";

// Pines
#define LIGHT_PIN 5
#define DHT_PIN 22
#define DHTTYPE DHT11
#define HW103_ANALOG_PIN 35
#define HW103_DIGITAL_PIN 21
#define SERVO_PIN 18

// Variables globales
bool lightState = false;
bool servoRunning = false;
unsigned long lastSensorUpdate = 0;
const unsigned long sensorInterval = 5000;

// Clientes y sensores
WiFiClientSecure espClient;
PubSubClient client(espClient);
DHT dht(DHT_PIN, DHTTYPE);
Servo servo;

void setup_wifi() {
  Serial.begin(115200);
  Serial.println("Conectando a WiFi...");
  WiFi.begin(ssid, password);

  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    Serial.print(".");
    intentos++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi conectado");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nError en conexión WiFi");
  }
}

// Callback MQTT
void callback(char* topic, byte* payload, unsigned int length) {
  String mensaje = "";
  for (int i = 0; i < length; i++) {
    mensaje += (char)payload[i];
  }

  if (String(topic) == "greenhouse/luces") {
    if (mensaje == "ON") {
      digitalWrite(LIGHT_PIN, HIGH);
      lightState = true;
      client.publish("greenhouse/luces/estado", "ON");
    } else if (mensaje == "OFF") {
      digitalWrite(LIGHT_PIN, LOW);
      lightState = false;
      client.publish("greenhouse/luces/estado", "OFF");
    }
  } else if (String(topic) == "greenhouse/servo") {
    if (mensaje == "ON") {
      servoRunning = true;
      client.publish("greenhouse/servo/estado", "ON");
    } else if (mensaje == "OFF") {
      servoRunning = false;
      servo.write(90); // Posición neutral
      client.publish("greenhouse/servo/estado", "OFF");
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    String clientId = "ESP32_Client-" + String(random(0xffff), HEX);

    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Conectado");
      client.subscribe("greenhouse/luces");
      client.subscribe("greenhouse/servo");
    } else {
      Serial.print("Error, rc=");
      Serial.print(client.state());
      Serial.println(" Reintento en 5s");
      delay(5000);
    }
  }
}

void setup() {
  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(HW103_ANALOG_PIN, INPUT);
  pinMode(HW103_DIGITAL_PIN, INPUT);
  
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  dht.begin();
  setup_wifi();

  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  servo.attach(SERVO_PIN);
  servo.write(90); // Posición inicial neutral
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  if (servoRunning) {
    servo.write(0);
    delay(500);
    servo.write(180);
    delay(500);
  }

  if (millis() - lastSensorUpdate > sensorInterval) {
    lastSensorUpdate = millis();

    // Lectura de sensores
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    int humSuelo = analogRead(HW103_ANALOG_PIN);
    int soilMoisturePercentage = map(humSuelo, 0, 4095, 100, 0);

    // Publicar datos
    String datos = "{\"temperatura\":" + String(temp) 
                 + ",\"humedad\":" + String(hum) 
                 + ",\"humedad_suelo\":" + String(humSuelo) 
                 + ",\"humedad_suelo_porcentaje\":" + String(soilMoisturePercentage) + "}";
    client.publish("greenhouse/sensores", datos.c_str());
  }
}