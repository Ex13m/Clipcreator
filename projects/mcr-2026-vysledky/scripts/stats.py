# statistiky: ryby po stanovištích (los), po kolech, po dnech -> data/stats.json
import json, collections
R=json.load(open('data/results.json'))
out={}
for k in ['d1','d2']:
    st=collections.Counter(); visits=collections.Counter(); zero=0; tot=0; matches=0
    for a in R[k]:
        for r in a['rounds']:
            if r['los'] is None: continue
            st[r['los']]+=r['fish'] or 0; visits[r['los']]+=1; tot+=r['fish'] or 0
            if not r['fish']: zero+=1
            matches+=1
    out[k]={'total':tot,'per_stand':dict(sorted(st.items())),'visits':dict(sorted(visits.items())),'zero_rounds':zero,'angler_rounds':matches,
            'per_round':[sum((a['rounds'][i]['fish'] or 0) for a in R[k]) for i in range(12)],
            'avg_per_angler':round(tot/len(R[k]),1)}
json.dump(out,open('data/stats.json','w'),indent=1)
for k in out:
    o=out[k]; ps=o['per_stand']
    best=sorted(ps.items(),key=lambda x:-x[1])[:5]; worst=sorted(ps.items(),key=lambda x:x[1])[:5]
    print(k,'total',o['total'],'avg/angler',o['avg_per_angler'],'nulová kola',o['zero_rounds'],'/',o['angler_rounds'])
    print('  best stands',best); print('  worst stands',worst)
    q=[sum(v for s,v in ps.items() if lo<=s<=lo+9) for lo in (1,11,21,31)]
    print('  sektory 1-10/11-20/21-30/31-40',q)
both={s:out['d1']['per_stand'].get(s,0)+out['d2']['per_stand'].get(s,0) for s in range(1,41)}
print('both best',sorted(both.items(),key=lambda x:-x[1])[:5],'worst',sorted(both.items(),key=lambda x:x[1])[:5])
