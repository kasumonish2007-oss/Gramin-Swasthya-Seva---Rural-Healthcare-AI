import React, { useState } from 'react';
import { X, Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, Send, User, ShieldCheck } from 'lucide-react';
import { Appointment } from '../types';

interface TeleconsultRoomModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const TeleconsultRoomModal: React.FC<TeleconsultRoomModalProps> = ({ appointment, onClose }) => {
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'Dr. System',
      text: 'Welcome to Gramin Telemedicine Room. Encrypted primary care consultation active.',
      time: '10:30 AM',
    },
    {
      sender: appointment?.doctorName || 'Doctor',
      text: 'Namaste! Please sit in a well-lit area. Have your blood pressure or thermometer readings ready if available.',
      time: '10:31 AM',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!appointment) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'You (Patient)',
        text: inputMsg.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
      <div className="bg-stone-900 rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] max-h-[700px] flex flex-col overflow-hidden border border-stone-800 text-white">
        {/* Header */}
        <div className="bg-stone-950 px-4 py-3 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">{appointment.doctorName}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 font-semibold uppercase">
                  Connected
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {appointment.doctorSpeciality} • Room ID: {appointment.teleconsultMeetingId || 'TELE-SESSION'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Area & Chat Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden bg-black">
          {/* Main Video Stream Simulation */}
          <div className="md:col-span-2 relative flex items-center justify-center bg-stone-950 p-4">
            {videoOn ? (
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-stone-800 to-stone-900 flex items-center justify-center border border-stone-800">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&fit=crop&crop=faces"
                  alt="Doctor Stream"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{appointment.doctorName} (Active)</span>
                </div>

                {/* Self View Floating Box */}
                <div className="absolute bottom-4 right-4 w-28 sm:w-36 h-20 sm:h-24 rounded-lg bg-stone-800 border-2 border-emerald-600/50 overflow-hidden shadow-lg flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-xs text-stone-400">
                    <User className="w-6 h-6 text-emerald-400 mb-1" />
                    <span>Self Camera</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-stone-500">
                <VideoOff className="w-12 h-12 mb-2" />
                <p className="text-sm">Camera feed is currently disabled</p>
              </div>
            )}
          </div>

          {/* Consultation Chat & Notes Sidebar */}
          <div className="hidden md:flex flex-col bg-stone-900 border-l border-stone-800">
            <div className="p-3 bg-stone-950/80 border-b border-stone-800 text-xs font-bold text-stone-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Consultation Live Chat</span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((m, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-stone-400">
                    <span className="font-semibold text-emerald-300">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="p-2 rounded-lg bg-stone-800/90 text-stone-200">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-2 border-t border-stone-800 flex gap-1">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask doctor a question..."
                className="flex-1 bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-white transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Video Action Controls Bar */}
        <div className="bg-stone-950 px-4 py-3 flex items-center justify-center gap-4 border-t border-stone-800">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`p-3 rounded-full transition cursor-pointer ${
              micOn ? 'bg-stone-800 hover:bg-stone-700 text-white' : 'bg-red-600 text-white'
            }`}
            title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`p-3 rounded-full transition cursor-pointer ${
              videoOn ? 'bg-stone-800 hover:bg-stone-700 text-white' : 'bg-red-600 text-white'
            }`}
            title={videoOn ? 'Turn Video Off' : 'Turn Video On'}
          >
            {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-sm flex items-center gap-2 transition shadow-lg cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
