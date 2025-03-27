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
/*#define HEATING_PIN 19
#define SERVO_PIN 18
#define WATER_PUMP_PIN 16

// Parámetros de control
const float TEMP_THRESHOLD = 21.0;
const float HUMIDITY_THRESHOLD = 60.0;
*/
// Variables globales
bool lightState = false;
bool heatingState = false;
unsigned long lastSensorUpdate = 0;
const unsigned long sensorInterval = 5000;

// Clientes y sensores
WiFiClientSecure espClient;
PubSubClient client(espClient);
DHT dht(DHT_PIN, DHTTYPE);
//Servo myServo;

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

/*/ Control de temperatura (sin servo)
void controlTemperature(float temperature) {
  if (temperature > TEMP_THRESHOLD && !heatingState) {
    digitalWrite(HEATING_PIN, HIGH);
    heatingState = true;
    client.publish("greenhouse/calefaccion", "ON");
    Serial.println("Calefacción activada");
  } else if (temperature <= TEMP_THRESHOLD && heatingState) {
    digitalWrite(HEATING_PIN, LOW);
    heatingState = false;
    client.publish("greenhouse/calefaccion", "OFF");
    Serial.println("Calefacción desactivada");
  }
}*/

/*/ Control de riego (sin servo)
void controlWatering(int soilMoisture, float humidity) {
  if (soilMoisture < 30 && humidity > HUMIDITY_THRESHOLD) {
    digitalWrite(WATER_PUMP_PIN, HIGH);
    client.publish("greenhouse/riego", "ON");
    Serial.println("Riego activado");
    delay(2000);
    digitalWrite(WATER_PUMP_PIN, LOW);
    client.publish("greenhouse/riego", "OFF");
  }
}*/

// Callback MQTT (actualizado para controlar servo)
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
  }
/*  else if (String(topic) == "greenhouse/servo") {  // Nuevo tema para servo
    if (mensaje == "ON") {
      //myServo.write(180);
      client.publish("greenhouse/servo/estado", "ON");
      Serial.println("Servo activado");
    } else if (mensaje == "OFF") {
      myServo.write(0);
      client.publish("greenhouse/servo/estado", "OFF");
      Serial.println("Servo desactivado");
    }
  }*/
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    String clientId = "ESP32_Client-" + String(random(0xffff), HEX);

    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Conectado");
      client.subscribe("greenhouse/luces");
      client.subscribe("greenhouse/servo");  // Suscripción al nuevo tema
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
//  pinMode(HEATING_PIN, OUTPUT);
//  pinMode(WATER_PUMP_PIN, OUTPUT);
  
//  myServo.attach(SERVO_PIN);
//  myServo.write(0);

  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  dht.begin();
  setup_wifi();

  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  if (millis() - lastSensorUpdate > sensorInterval) {
    lastSensorUpdate = millis();

    // Lectura de sensores
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    int humSuelo = analogRead(HW103_ANALOG_PIN);

    int soilMoisturePercentage = map(soilMoistureAnalog, 0, 4095, 100, 0);


//    Control automático (sin servo)
//    controlTemperature(temp);
//    controlWatering(humSuelo, hum);

    // Publicar datos
    String datos = "{\"temperatura\":" + String(temp) 
                 + ",\"humedad\":" + String(hum) 
                 + ",\"humedad_suelo\":" + String(humSuelo) 
                 + ",\"humedad_suelo_porcentaje\":" + String(soilMoisturePercentage)}";
    client.publish("greenhouse/sensores", datos.c_str());
  }
}