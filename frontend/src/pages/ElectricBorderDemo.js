import React from 'react';
import ElectricBorder from '../components/ElectricBorder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Zap, Settings, Palette } from 'lucide-react';

const ElectricBorderDemo = () => {
  return (
    <div className="min-h-screen bg-gaming-dark py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gaming-text mb-4">
            Electric Border <span className="text-gaming-accent">Component</span>
          </h1>
          <p className="text-xl text-gaming-text-secondary max-w-3xl mx-auto">
            A stunning animated border effect inspired by Balint Ferenczy's CodePen. 
            Features turbulent displacement filters and customizable colors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <ElectricBorder
            color="#7df9ff"
            speed={1}
            chaos={0.5}
            thickness={2}
            style={{ borderRadius: 24 }}
          >
            <Card className="bg-gaming-card border-0 h-full rounded-[22px] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-cyan-500/20">
                    <Zap className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
                <CardTitle className="text-center text-gaming-text">Default Cyan</CardTitle>
                <CardDescription className="text-center text-gaming-text-secondary">
                  Classic electric blue effect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gaming-text-secondary">
                  <div className="flex justify-between">
                    <span>Color:</span>
                    <span className="text-cyan-400">#7df9ff</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span>1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chaos:</span>
                    <span>0.5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ElectricBorder>

          <ElectricBorder
            color="#10b981"
            speed={1.5}
            chaos={0.7}
            thickness={2}
            style={{ borderRadius: 24 }}
          >
            <Card className="bg-gaming-card border-0 h-full rounded-[22px] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-green-500/20">
                    <Settings className="w-12 h-12 text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-center text-gaming-text">Fast Green</CardTitle>
                <CardDescription className="text-center text-gaming-text-secondary">
                  High speed with more chaos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gaming-text-secondary">
                  <div className="flex justify-between">
                    <span>Color:</span>
                    <span className="text-green-400">#10b981</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span>1.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chaos:</span>
                    <span>0.7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ElectricBorder>

          <ElectricBorder
            color="#f97316"
            speed={0.8}
            chaos={0.3}
            thickness={2}
            style={{ borderRadius: 24 }}
          >
            <Card className="bg-gaming-card border-0 h-full rounded-[22px] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-orange-500/20">
                    <Palette className="w-12 h-12 text-orange-400" />
                  </div>
                </div>
                <CardTitle className="text-center text-gaming-text">Smooth Orange</CardTitle>
                <CardDescription className="text-center text-gaming-text-secondary">
                  Slower with less chaos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gaming-text-secondary">
                  <div className="flex justify-between">
                    <span>Color:</span>
                    <span className="text-orange-400">#f97316</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span>0.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chaos:</span>
                    <span>0.3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ElectricBorder>
        </div>

        <div className="max-w-4xl mx-auto">
          <ElectricBorder
            color="#a855f7"
            speed={1.2}
            chaos={0.5}
            thickness={2}
            style={{ borderRadius: 24 }}
          >
            <Card className="bg-gaming-card border-0 rounded-[22px] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl text-gaming-text">Component Props</CardTitle>
                <CardDescription className="text-gaming-text-secondary">
                  Customize the electric border effect with these properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gaming-light/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gaming-text mb-2">color</h4>
                      <p className="text-sm text-gaming-text-secondary">
                        Hex color code for the border (default: #7df9ff)
                      </p>
                    </div>
                    <div className="bg-gaming-light/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gaming-text mb-2">speed</h4>
                      <p className="text-sm text-gaming-text-secondary">
                        Animation speed multiplier (default: 1)
                      </p>
                    </div>
                    <div className="bg-gaming-light/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gaming-text mb-2">chaos</h4>
                      <p className="text-sm text-gaming-text-secondary">
                        Turbulence intensity 0-1 (default: 0.5)
                      </p>
                    </div>
                    <div className="bg-gaming-light/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gaming-text mb-2">thickness</h4>
                      <p className="text-sm text-gaming-text-secondary">
                        Border thickness in pixels (default: 2)
                      </p>
                    </div>
                  </div>

                  <div className="bg-gaming-dark/50 p-6 rounded-lg mt-6">
                    <h4 className="font-semibold text-gaming-text mb-3">Usage Example</h4>
                    <pre className="text-sm text-gaming-text-secondary overflow-x-auto">
{`<ElectricBorder
  color="#7df9ff"
  speed={1}
  chaos={0.5}
  thickness={2}
  style={{ borderRadius: 24 }}
>
  <YourComponent />
</ElectricBorder>`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ElectricBorder>
        </div>
      </div>
    </div>
  );
};

export default ElectricBorderDemo;
