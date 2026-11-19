
function obj(v){if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Expected an object');return v;}
function arr(v,label='array'){if(!Array.isArray(v)||v.length>500)throw Error(label+' must be an array with at most 500 items');return v;}
function str(v){if(typeof v!=='string'||!v.trim()||v.length>100000)throw Error('Expected nonempty text (max 100000 characters)');return v;}
function num(v,label='number',min=-1e12){if(typeof v!=='number'||!Number.isFinite(v)||v<min||Math.abs(v)>1e12)throw Error(label+' must be a finite number in range');return v;}
function bool(v){if(typeof v!=='boolean')throw Error('Expected a boolean');return v;}
function date(v){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))throw Error('Expected YYYY-MM-DD');const t=Date.parse(v+'T00:00:00Z');if(!Number.isFinite(t)||new Date(t).toISOString().slice(0,10)!==v)throw Error('Invalid calendar date');return t;}
export function run(x){obj(x);if(JSON.stringify(x).length>200000)throw Error('Input exceeds 200 KB limit');

const rows=arr(x.sessions,'sessions').map(s=>{str(s.id);num(s.failures,'failures',0);bool(s.newDevice);bool(s.impossibleTravel);const reasons=[];let score=0;if(s.failures>=5){score+=30;reasons.push('five or more failed attempts');}if(s.newDevice){score+=20;reasons.push('unrecognized device');}if(s.impossibleTravel){score+=50;reasons.push('supplied travel anomaly');}return {id:s.id,score,decision:score>=50?'review':'observe',reasons:reasons.join('; ')||'no configured signals'};});return {metrics:{sessions:rows.length,review:rows.filter(r=>r.decision==='review').length},rows};

}
